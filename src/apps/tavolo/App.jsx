import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import HiddenReload from '../../shared/components/HiddenReload'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <HiddenReload />
    </>
  )
}
