export default function ToggleSwitch({ onChange, checked = false, label }: { onChange?: React.ChangeEventHandler<HTMLInputElement>; checked?: boolean; label?: string }) {
	return (
		<label className="inline-flex items-center cursor-pointer">
			<input type="checkbox" className="sr-only peer" onChange={onChange} defaultChecked={checked} />
			<div className="relative w-11 h-6 outline-none focus:outline-none peer-focus:ring-0 rounded-full peer bg-zinc-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full border-0 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-zinc-600 peer-checked:bg-zinc-600"></div>
			{label ? <span className="ms-3 text-sm font-medium text-primary">{label}</span> : null}
		</label>
	);
}
