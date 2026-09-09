import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  color: #13213a;
  background: #f6f8fc;
`;

export const Header = styled.header`
  background: #fff;
  border-bottom: 1px solid #e7ebf2;
`;

export const HeaderContent = styled.div`
  width: min(100% - 40px, 1180px);
  min-height: 72px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 620px) {
    min-height: auto;
    padding: 14px 0;
    flex-wrap: wrap;
    gap: 14px;
  }
`;

export const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #172554;
  font-size: 1.1rem;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
`;

export const BrandIcon = styled.span`
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  background: #2f65e9;
  border-radius: 10px;
  font-size: 1.2rem;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 26px;
  margin-right: auto;

  @media (max-width: 620px) {
    order: 3;
    width: 100%;
    gap: 20px;
  }
`;

export const NavLink = styled.a<{ $active?: boolean }>`
  color: ${({ $active }) => ($active ? "#2f65e9" : "#5b6780")};
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;

  &:hover { color: #2f65e9; }
`;

export const LoginLink = styled.a`
  padding: 10px 14px;
  color: #2f65e9;
  border: 1px solid #cfdcff;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;

  @media (max-width: 620px) { margin-left: auto; }
`;

export const Container = styled.main`
  width: min(100% - 40px, 1180px);
  margin: 0 auto;
  padding: 56px 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 285px;
  gap: 42px;

  @media (max-width: 850px) { grid-template-columns: 1fr; }
  @media (max-width: 620px) { width: min(100% - 28px, 1180px); padding: 36px 0; }
`;

export const Hero = styled.div`
  margin-bottom: 30px;
  h1 { margin: 0; color: #152a57; font-size: clamp(2rem, 4vw, 3.15rem); line-height: 1.12; }
  p { max-width: 650px; margin: 14px 0 0; color: #64718a; font-size: 1rem; line-height: 1.65; }
`;

export const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: #2f65e9;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.09em;
`;

export const SearchBox = styled.label`
  height: 54px;
  margin-bottom: 34px;
  padding: 0 17px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #dce2ec;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgb(34 52 84 / 4%);
  span { color: #70809c; font-size: 1.6rem; line-height: 1; }
  input { width: 100%; color: #172554; background: transparent; border: 0; outline: 0; }
`;

export const FilterSection = styled.section`
  margin-bottom: 22px;
  h2 { margin: 0; color: #172554; font-size: 1.35rem; }
  p { margin: 6px 0 17px; color: #71809a; font-size: 0.9rem; }
`;

export const Filters = styled.div`display: flex; flex-wrap: wrap; gap: 9px;`;

export const FilterButton = styled.button<{ $selected?: boolean }>`
  padding: 8px 13px;
  color: ${({ $selected }) => ($selected ? "#fff" : "#55627a")};
  background: ${({ $selected }) => ($selected ? "#2f65e9" : "#fff")};
  border: 1px solid ${({ $selected }) => ($selected ? "#2f65e9" : "#dbe2ed")};
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 650;
  &:hover { color: #fff; background: #2f65e9; border-color: #2f65e9; }
`;

export const PostsList = styled.div`display: grid; gap: 16px;`;
export const PostCard = styled.article`
  padding: 24px;
  background: #fff;
  border: 1px solid #e1e6ef;
  border-radius: 12px;
  box-shadow: 0 8px 22px rgb(30 50 85 / 5%);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 13px 30px rgb(30 50 85 / 10%); }
  h2 { margin: 16px 0 10px; color: #172554; font-size: 1.25rem; }
  > p { margin: 0; color: #617089; line-height: 1.6; }
  @media (max-width: 620px) { padding: 19px; }
`;
export const PostTop = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 16px;`;
export const SubjectTag = styled.span`padding: 6px 10px; color: #2856c8; background: #e9efff; border-radius: 999px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.03em; text-transform: uppercase;`;
export const DateText = styled.time`color: #7a879d; font-size: 0.8rem;`;
export const PostFooter = styled.div`margin-top: 22px; padding-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid #edf0f5; span { color: #7a879d; font-size: 0.8rem; } button { padding: 0; color: #2f65e9; background: transparent; border: 0; cursor: pointer; font: inherit; font-size: 0.86rem; font-weight: 800; &:hover { text-decoration: underline; } } @media (max-width: 620px) { align-items: flex-start; flex-direction: column; gap: 8px; }`;
export const Sidebar = styled.aside`display: grid; align-content: start; gap: 18px; padding-top: 12px; @media (max-width: 850px) { grid-template-columns: repeat(2, minmax(0, 1fr)); padding-top: 0; } @media (max-width: 620px) { grid-template-columns: 1fr; }`;
export const SidebarCard = styled.section<{ $highlighted?: boolean }>`padding: 22px; color: ${({ $highlighted }) => ($highlighted ? "#fff" : "inherit")}; background: ${({ $highlighted }) => ($highlighted ? "#244ba8" : "#fff")}; border: 1px solid ${({ $highlighted }) => ($highlighted ? "#244ba8" : "#e1e6ef")}; border-radius: 12px; h2 { margin: 0 0 16px; color: ${({ $highlighted }) => ($highlighted ? "#fff" : "#172554")}; font-size: 1.08rem; } a { display: block; padding: 13px 0; color: #53627a; border-top: 1px solid #edf0f5; font-size: 0.9rem; text-decoration: none; &:hover { color: #2f65e9; } }`;
export const EmptyState = styled.div`padding: 50px 20px; background: #fff; border: 1px dashed #cad3e3; border-radius: 12px; text-align: center; span { font-size: 2rem; } h2 { margin: 12px 0 8px; color: #172554; font-size: 1.2rem; } p { margin: 0 0 18px; color: #697790; } button { padding: 0; color: #2f65e9; background: transparent; border: 0; cursor: pointer; font: inherit; font-weight: 800; &:hover { text-decoration: underline; } }`;