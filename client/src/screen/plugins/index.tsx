export default function Plugins() {
  return (
    <div>
      <button
        onClick={async () => {
          const data = await fetch("/plugin/upload");
          console.log(data);
        }}
      >
        Add plugins2
      </button>
    </div>
  );
}
