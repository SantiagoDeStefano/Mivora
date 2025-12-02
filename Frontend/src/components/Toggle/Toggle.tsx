export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "flex w-full items-center justify-between rounded-xl border p-4 text-left transition",
        checked ? "border-pink-700 bg-pink-900/10" : "border-gray-800 hover:border-gray-700"
      ].join(" ")}
    >
      <span className="text-sm">{label}</span>
      <span
        className={[
          "relative inline-flex h-6 w-10 items-center rounded-full transition",
          checked ? "bg-pink-600" : "bg-gray-700"
        ].join(" ")}
      >
        <span className={["inline-block h-4 w-4 transform rounded-full bg-white transition", checked ? "translate-x-5" : "translate-x-1"].join(" ")} />
      </span>
    </button>
  );
}
