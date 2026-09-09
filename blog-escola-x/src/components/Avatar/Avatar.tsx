import styled from "styled-components";

interface AvatarProps {
  name: string;
}

const AvatarCircle = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 0.875rem;
  font-weight: 600;
`;

export function Avatar({ name }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AvatarCircle
      aria-label={name}
    >
      {initials || "?"}
    </AvatarCircle>
  );
}

export default Avatar;