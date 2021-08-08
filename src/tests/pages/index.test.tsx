import Home from '@/pages'
import { render } from '@testing-library/react'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe(`<Home />`, () => {
  beforeEach(() => {
    useRouter.mockImplementationOnce(() => ({
      push: jest.fn(),
    }))
  })

  it(`should render`, () => {
    const { container } = render(<Home />)
    expect(container).toBeTruthy()
  })
})
