import { ImageUp } from "lucide-react";
import type { ImageUplaodFormProps } from "../types";
import ImagePreview from "./ImagePreview";
import { useMemo } from "react";

export default function ImageUploadForm({
  isVisible,
  inputs,
  handleChange,
  handleSubmit,
}: ImageUplaodFormProps) {
  const isDisabled = useMemo(() => {
    return !!Object.values(inputs).some((input) => !input);
  }, [inputs]);

  return (
    isVisible && (
      <div className="flex flex-col md:flex-row md:gap-8">
        <ImagePreview {...inputs} />

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <p className="text-2xl font-bold ">Upload Image</p>
          <input
            type="text"
            name="title"
            placeholder="Image Title"
            className="
            bg-neutral-secondary-medium
            border border-sky-500
            text-heading text-sm
            rounded-lg
            block w-full px-2.5 py-2
            shadow-xs
            outline-none
            transition-all duration-300

            hover:shadow-lg hover:shadow-blue-500/40

            "
            onChange={handleChange}
          />
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="bg-transparent
            border border-sky-500
            px-4 py-2
            rounded-md
            text-sky-600
            cursor-pointer
            outline-none
            transition-all duration-300
        
            hover:shadow-lg hover:shadow-sky-500/40
        
            file:mr-4
            file:py-2 file:px-4
            file:rounded-md
            file:border-0
            file:bg-sky-500
            file:text-white
            file:font-medium
            file:cursor-pointer
            file:hover:bg-sky-600"
            onChange={handleChange}
            // Limit file size to 5MB (5 * 1024 * 1024 bytes)
            // Server-side validation is also needed
          />
          <button
            type="submit"
            className="border rounded-sm px-3 py-2 cursor-pointer flex gap-2 justify-center disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:border-none"
            disabled={isDisabled}
          >
            <ImageUp /> Upload
          </button>
        </form>
      </div>
    )
  );
}
