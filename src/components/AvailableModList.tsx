import { useQuery } from "@apollo/client";
import { gql } from "../__generated__/gql";
import ModList from "../components/ModList";
import { useState } from "react";

const GET_PACKAGES = gql(`
	query GET_PACKAGES($search: String, $offset: Int = 0, $limit: Int = 20) {
		packages(search: $search, offset: $offset, limit: $limit) {
      result {
        name
        owner
        package_url
        rating_score
        full_name
        has_nsfw_content
        donation_link
        date_created
        date_updated
        versions {
          icon
        }
      }
      total
		}
	}
`);

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const { error, data, refetch } = useQuery(GET_PACKAGES, {
		variables: {
			offset: 0,
			limit: 20,
		},
	});

	const handleUpdate = (search: string, page: number) => {
		console.log("REFETCHING");
		setLoading(true);

		refetch({
			search,
			offset: 20 * page,
			limit: 20,
		}).then(() => {
			setLoading(false);
		});
	};

	return (
		<>
			<ModList packages={loading ? [] : data.packages.result} limit={20} total={loading ? 0 : data.packages.total} loading={loading} onUpdate={handleUpdate} error={error ? error.message : undefined} />
		</>
	);
}
