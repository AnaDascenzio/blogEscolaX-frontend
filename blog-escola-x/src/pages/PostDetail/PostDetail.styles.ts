import styled from "styled-components";
import { Link } from "react-router-dom";

// ── Page ─────────────────────────────────────────────────────────────────────

export const Page = styled.div`
  min-height: 100vh;
  background: var(--color-background);
  padding: 24px 0 56px;
`;

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Breadcrumb = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const BackButton = styled.button`
  display: inline-block;
  margin-bottom: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const StateMsg = styled.p<{ $error?: boolean }>`
  text-align: center;
  padding: 64px 0;
  font-size: 0.95rem;
  color: ${({ $error }) =>
    $error ? "var(--color-danger)" : "var(--color-text-secondary)"};
`;

// ── Error / Not Found state ──────────────────────────────────────────────────

export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
`;

export const ErrorCard = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`;

export const ErrorIconCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary-light);
  display: grid;
  place-items: center;
  margin: 0 auto 24px;
`;

export const ErrorTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 1.35rem;
  color: var(--color-text);
  line-height: 1.3;
`;

export const ErrorDescription = styled.p`
  margin: 0 0 28px;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

export const ErrorBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

// ── Grid ─────────────────────────────────────────────────────────────────────

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  align-items: start;

  @media (max-width: 740px) {
    grid-template-columns: 1fr;
  }
`;

// ── Article ───────────────────────────────────────────────────────────────────

export const Article = styled.article`
  background: var(--color-white);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 740px) {
    padding: 18px;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
`;

export const BadgeXs = styled(Badge)`
  font-size: 0.7rem;
  padding: 2px 8px;
`;

export const ReadingTime = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.25;
  color: var(--color-text);

  @media (max-width: 740px) {
    font-size: 1.35rem;
  }
`;

// ── Author row (top) ──────────────────────────────────────────────────────────

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 12px 0;

  @media (max-width: 740px) {
    flex-wrap: wrap;
  }
`;

export const AuthorMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;

  strong {
    font-size: 0.875rem;
    color: var(--color-text);
    line-height: 1.2;
  }

  span {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
`;

export const PubDate = styled.span`
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  white-space: nowrap;

  @media (max-width: 740px) {
    width: 100%;
    margin-top: 4px;
  }
`;

// ── Avatar ────────────────────────────────────────────────────────────────────

export const Avatar = styled.div<{ $size: "sm" | "lg" }>`
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;

  width: ${({ $size }) => ($size === "lg" ? "56px" : "38px")};
  height: ${({ $size }) => ($size === "lg" ? "56px" : "38px")};
  font-size: ${({ $size }) => ($size === "lg" ? "1.1rem" : "0.875rem")};
`;

// ── Cover image ───────────────────────────────────────────────────────────────

export const Cover = styled.figure`
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);

  img {
    display: block;
    width: 100%;
    max-height: 380px;
    object-fit: cover;
  }

  figcaption {
    padding: 10px 14px;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    font-style: italic;
    text-align: center;
    border-top: 1px solid var(--color-border);
  }
`;

// ── Body ──────────────────────────────────────────────────────────────────────

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--color-text);
  }
`;

// ── Subject row ───────────────────────────────────────────────────────────────

export const SubjectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
`;

export const SubjectLabel = styled.span`
  color: var(--color-text-secondary);
`;

export const SubjectValue = styled.span`
  font-weight: 600;
`;

// ── Callout ───────────────────────────────────────────────────────────────────

export const Callout = styled.div`
  background: var(--color-primary-light);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 8px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CalloutTitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
`;

export const CalloutLink = styled.a`
  font-size: 0.875rem;
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// ── Timestamps ────────────────────────────────────────────────────────────────

export const Timestamps = styled.div`
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
`;

// ── Author card (bottom) ──────────────────────────────────────────────────────

export const AuthorCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 20px;
`;

export const AuthorCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AuthorCardName = styled.strong`
  font-size: 0.95rem;
  color: var(--color-text);
`;

export const AuthorCardRole = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
`;

export const AuthorCardBio = styled.p`
  margin: 6px 0 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.55;
`;

// ── Sidebar ───────────────────────────────────────────────────────────────────

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SidebarCard = styled.div`
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 18px;

  h3 {
    margin: 0 0 14px;
    font-size: 0.875rem;
    color: var(--color-text);
  }
`;

export const SidebarEmpty = styled.p`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
`;

// ── Related posts ─────────────────────────────────────────────────────────────

export const RelatedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

export const RelatedItem = styled.li`
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
`;

export const RelatedTitle = styled.p`
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.15s;
`;

export const RelatedLink = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  text-decoration: none;

  &:hover ${RelatedTitle} {
    color: var(--color-primary);
  }
`;

export const RelatedThumb = styled.div`
  width: 52px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-border);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const RelatedThumbBg = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1.1rem;
`;

export const RelatedText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RelatedTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const RelatedDate = styled.span`
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  margin-left: 4px;
`;

// ── Safe space ────────────────────────────────────────────────────────────────

export const SafeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;

  h3 {
    margin: 0;
  }
`;

export const SafeDesc = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.55;
`;

// ── Useful links ──────────────────────────────────────────────────────────────

export const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const UsefulLink = styled.a`
  font-size: 0.82rem;
  color: var(--color-text);
  text-decoration: none;

  &:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
`;