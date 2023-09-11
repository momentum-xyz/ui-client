import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
  gap: 10px;
`;

export const Label = styled.div`
  font-size: var(--font-size-s);
  font-weight: 400;
  letter-spacing: 0.26px;
  text-transform: none;
  line-height: 15px;
`;

export const Hexagon = styled.div`
  display: flex;
  width: 90px;
  height: 90px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.accentText};
`;

export const Separator = styled.div`
  margin: 10px 0;
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const AIInfoContainer = styled.div`
  padding: 10px;
  display: flex;
  border-radius: 4px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  box-shadow: -1px -1px 2px 0px rgba(158, 238, 255, 0.1);
  gap: 20px;

  &.disabled {
    opacity: 0.4;
  }
`;

export const AIImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
`;

export const AIInfo = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 3px;
  text-transform: uppercase;

  span {
    font-size: var(--font-size-m);
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0.28px;
    text-transform: none;
  }
`;

export const MaxCredits = styled.div`
  padding: 10px 0 0 0;
  text-align: right;
  font-size: var(--font-size-s);
  font-weight: 600;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const SubTitle = styled.div`
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-weight: 600;
  line-height: 18px;
`;

export const CreditsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 160px 160px;
  align-items: center;
  gap: 10px;

  &.noAI {
    grid-template-columns: 1fr 160px;
  }
`;

export const QuestionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const QuestionBlock = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 10px;
`;

export const Question = styled.div`
  padding: 6px 0 0 0;
  font-size: var(--font-size-s);
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const AICreditsContainer = styled.div`
  padding: 0 0 0 20px;
  display: flex;
  height: 38px;
  align-items: center;
  border-radius: 4px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 20px;
`;

export const ImageContainer = styled.div`
  display: flex;
  width: 160px;
  height: 145px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.text};
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
`;

export const Image = styled.img`
  width: 90px;
  height: 105px;
`;

export const PreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const FlightMessage = styled.div`
  padding: 10px;
  display: flex;
  border-radius: 4px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  gap: 10px;
`;
