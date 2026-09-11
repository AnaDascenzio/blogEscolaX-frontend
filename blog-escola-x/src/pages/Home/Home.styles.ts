import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  background-color: #eff6ff;
  padding: 16px;

  @media (min-width: 640px) {
    padding: 32px 24px;
  }
`;

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 72rem;
`;

export const Header = styled.header`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const HeaderBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderIconBox = styled.div`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #dbeafe;
  color: #2563eb;
`;

export const HeaderText = styled.div`
  strong {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    color: #0f172a;
  }

  span {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
  }
`;

export const SearchInput = styled.input`
  margin-bottom: 16px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  padding: 10px 16px;
  font-size: 0.875rem;
  color: #334155;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.5);
  }
`;

export const FilterGroup = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  border-radius: 9999px;
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: ${({ $active }) => ($active ? "#2563eb" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#475569")};
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#1d4ed8" : "#f8fafc")};
  }
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 272px;
  }
`;

export const PostsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StatusCard = styled.p`
  border-radius: 12px;
  background-color: #ffffff;
  padding: 24px;
  text-align: center;
  color: #64748b;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin: 0;
`;

export const ErrorCard = styled.div`
  border-radius: 12px;
  background-color: #fef2f2;
  padding: 20px;
  font-size: 0.875rem;
  color: #dc2626;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  p {
    margin: 0;
  }

  button {
    margin-top: 8px;
    font-weight: 500;
    color: #2563eb;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PostCard = styled.article`
  border-radius: 12px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const PostHeader = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SubjectBadge = styled.span`
  display: inline-block;
  border-radius: 9999px;
  background-color: #eff6ff;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #2563eb;
`;

export const PostDate = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
`;

export const PostTitle = styled.h2`
  margin: 0 0 4px 0;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;

  &:hover {
    text-decoration: underline;
  }
`;

export const PostSummary = styled.p`
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
`;

export const PostFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const PostAuthor = styled.span`
  font-size: 0.875rem;
  color: #475569;
`;

export const ReadMoreButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2563eb;

  &:hover {
    text-decoration: underline;
  }
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WelcomeCard = styled.div`
  border-radius: 12px;
  background-color: #2563eb;
  padding: 20px;
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  strong {
    display: block;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.4;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 0.875rem;
    color: #dbeafe;
    line-height: 1.5;
  }
`;

export const SafeSpaceCard = styled.div`
  border-radius: 12px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  strong {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.5;
  }
`;