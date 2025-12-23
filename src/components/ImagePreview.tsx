interface ImagePreviewProps {
  path: string | null;
}

export default function ImagePreview({ path }: ImagePreviewProps) {
  return (
    path && (
      <div className="w-full h-64 rounded-md overflow-hidden bg-zinc-100">
        <img
          src={path}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>

    )
  );
}
