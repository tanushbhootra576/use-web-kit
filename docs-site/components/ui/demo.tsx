import { GooeyLoader } from "@/components/ui/loader-10"; // Adjust path as needed

export default function GooeyLoaderDemo() {
  return (
    // A minimal container to center the component for presentation.
    <div className="flex items-center justify-center w-full min-h-[250px]">
      <GooeyLoader
        primaryColor="#5BE30C" // Using site accent color
        secondaryColor="rgba(91, 227, 12, 0.5)" // Semi-transparent accent
        borderColor="rgba(255, 255, 255, 0.05)" // Subtle border
      />
    </div>
  );
}
