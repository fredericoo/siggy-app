import Home from '@/pages'
import { render } from '@testing-library/react'

describe(`<Home />`, () => {
  it(`should render`, () => {
    const { container } = render(<Home />)
    expect(container).toBeTruthy()
  })
})
