import { Global, css } from '@emotion/react'

const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  body,
  html {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Oswald', sans-serif;
    font-style: normal;
    color: #212121;
  }

  h1 {
    font-size: 48px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0.96px;
  }

  h2,
  h3 {
    font-size: 24px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0.48px;
  }

  h4,
  h5,
  h6,
  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: 0.32px;
  }

  #root {
    display: flex;
    min-height: 100%;
  }
`

function GlobalStyles() {
  return <Global styles={globalStyles} />
}

export default GlobalStyles
