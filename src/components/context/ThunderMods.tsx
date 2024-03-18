import { gql } from "../../__generated__/gql";
import { Get_PackagesQuery } from "../../__generated__/graphql";
import { useQuery } from "@apollo/client";
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

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
				downloads
				categories
        versions {
          icon
					version_number
					description
					full_name
					dependencies
					website_url
        }
      }
      total
		}
	}
`);

const ThunderContext = createContext<{
	packages: Get_PackagesQuery["packages"]["result"];
	total: Get_PackagesQuery["packages"]["total"];
	loading: boolean;
	error: string | undefined;
	limit: number;
	onUpdate: (search: string, page: number) => void;
} | null>(null);

function ThunderModsProvider({ children }: { children: ReactNode }) {
	const [loading, setLoading] = useState(true);
	const { error, data, refetch } = useQuery(GET_PACKAGES, {
		variables: {
			offset: 0,
			limit: 20,
		},
	});

	const handleUpdate = (search: string, page: number) => {
		setLoading(true);

		refetch({
			search: search.replace(/ /g, ""),
			offset: 20 * page,
			limit: 20,
		}).then(() => {
			setLoading(false);
		});
	};

	const values = useMemo(() => {
		return { packages: loading ? [] : data.packages.result, limit: 20, total: loading ? 0 : data.packages.total, loading, onUpdate: handleUpdate, error: error ? error.message : undefined };
	}, [data, loading]);

	return <ThunderContext.Provider value={values}>{children}</ThunderContext.Provider>;
}

function useThunderModsContext() {
	const context = useContext(ThunderContext);

	if (context === null) {
		throw new Error(`Bills context must be used within the provider`);
	}

	return context;
}

export { ThunderContext, useThunderModsContext, ThunderModsProvider };
