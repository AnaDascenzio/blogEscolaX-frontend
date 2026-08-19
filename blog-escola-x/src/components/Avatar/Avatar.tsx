interface AvatarProps {
  name: string;
  src?: string;
}

export function Avatar({ name, src }: AvatarProps) {
  return src ? <img src={src} alt={`Avatar de ${name}`} /> : <span aria-label={`Avatar de ${name}`}>{name.charAt(0).toUpperCase()}</span>;
}