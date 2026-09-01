interface AvatarProps {
  name: string;
}

export function Avatar({ name }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      aria-label={name}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
    >
      {initials || "?"}
    </div>
  );
}

export default Avatar;