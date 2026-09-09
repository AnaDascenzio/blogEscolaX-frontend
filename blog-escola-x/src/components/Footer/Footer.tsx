import styled from "styled-components";

const FooterText = styled.footer`
  margin-top: 32px;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  text-align: center;
`;

export function Footer() {
  return (
    <FooterText>
      🛡️ Portal Escolar • Espaço seguro & moderado para livre expressão de professores e alunos
    </FooterText>
  );
}