import styled from 'styled-components';
import Theme from '../../theme';

const Background = styled.div`
  background-color: ${Theme};
  font-family: 'Varela Round';
  color: ${p => (p.theme.mode === 'dark' ? '#fff' : '#000')};
`;

export default Background;
