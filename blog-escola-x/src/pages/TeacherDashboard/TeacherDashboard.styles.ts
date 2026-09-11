import styled from "styled-components";

export const Loading = styled.main`min-height: 100vh; display: grid; place-items: center; color: var(--color-primary); background: var(--color-primary-light);`;
export const Page = styled.main`min-height: 100vh; padding: 16px; background: var(--color-primary-light); @media (min-width: 640px) { padding: 32px 24px; }`;
export const Container = styled.div`max-width: 1152px; margin: 0 auto;`;
export const Search = styled.input`width: 100%; margin-bottom: 16px; padding: 10px 16px; color: #334155; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .875rem; outline: none; &:focus { box-shadow: 0 0 0 2px #93c5fd; }`;
export const Filters = styled.div`display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;`;
export const Filter = styled.button<{ $active?: boolean }>`padding: 6px 12px; color: ${({ $active }) => ($active ? "#fff" : "#475569")}; background: ${({ $active }) => ($active ? "#2563eb" : "#fff")}; border: 0; border-radius: 999px; cursor: pointer; font-size: .875rem; font-weight: 500; &:hover { background: ${({ $active }) => ($active ? "#1d4ed8" : "#f8fafc")}; }`;
export const ErrorMessage = styled.p`margin: 0 0 16px; padding: 12px 16px; color: #dc2626; background: #fef2f2; border-radius: 8px; font-size: .875rem;`;
export const Grid = styled.div`display: grid; grid-template-columns: 1fr; align-items: start; gap: 24px; @media (min-width: 1024px) { grid-template-columns: minmax(0, 1fr) 320px; }`;
export const PostList = styled.section`display: grid; align-content: start; gap: 16px;`;
export const Empty = styled.p`margin: 0; padding: 24px; color: #64748b; background: #fff; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgb(15 23 42 / 8%);`;
export const Post = styled.article`
  padding: 24px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07);
  }
`;

export const PostMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SubjectBadge = styled.span<{ $bg?: string; $color?: string }>`
  display: inline-block;
  padding: 4px 12px;
  color: ${({ $color }) => $color || "#2563eb"};
  background-color: ${({ $bg }) => $bg || "#eff6ff"};
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
`;

export const Subject = SubjectBadge;

export const DateText = styled.span`
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 400;
`;

export const Title = styled.h2`
  margin: 0 0 10px;
  color: #0f172a;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.35;
  transition: color 0.15s ease;

  &:hover {
    color: #2563eb;
  }
`;

export const Summary = styled.p`
  margin: 0 0 20px;
  color: #475569;
  font-size: 0.9375rem;
  line-height: 1.6;
`;

export const PostFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
`;

export const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const AuthorName = styled.strong`
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const AuthorSubtitle = styled.span`
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.2;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #2563eb;
  background-color: #eff6ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #dbeafe;
    color: #1d4ed8;
  }
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #ef4444;
  background-color: #fef2f2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #fee2e2;
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Action = styled.button<{ $danger?: boolean; $link?: boolean }>`
  padding: ${({ $link }) => ($link ? "0" : "8px 16px")};
  color: ${({ $danger, $link }) => ($danger ? "#ef4444" : $link ? "#2563eb" : "#2563eb")};
  background: ${({ $danger, $link }) => ($link ? "transparent" : $danger ? "#fef2f2" : "#eff6ff")};
  border: 0;
  border-radius: ${({ $link }) => ($link ? "0" : "8px")};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease-in-out;

  &:hover {
    text-decoration: ${({ $link }) => ($link ? "underline" : "none")};
    background: ${({ $danger, $link }) => ($link ? "transparent" : $danger ? "#fee2e2" : "#dbeafe")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ReadMoreSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
`;

export const ReadingTime = styled.span`
  color: #64748b;
`;

export const Separator = styled.span`
  color: #cbd5e1;
`;

export const ReadMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

export const Sidebar = styled.aside`
  display: grid;
  gap: 16px;
`;

export const Welcome = styled.div`
  padding: 20px;
  color: #fff;
  background: #2563eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(15 23 42 / 8%);
  p {
    margin: 0;
    &:last-child {
      margin-top: 4px;
      color: #dbeafe;
      font-size: 0.875rem;
    }
  }
`;

export const InfoCard = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(15 23 42 / 8%);
  p {
    margin: 0;
    color: #475569;
    font-size: 0.875rem;
    &:first-child {
      font-weight: 500;
    }
    &:not(:first-child) {
      margin-top: 4px;
      color: #64748b;
      font-size: 0.75rem;
    }
  }
`;

export const Count = styled.p`
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #0f172a !important;
`;