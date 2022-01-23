import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'uikit/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const baseUrl = process.env.REACT_APP_BASE_URL

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'OpenSans-Bold';
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    background-image: url(/images/backgroundImag.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
