type ErrorsProps = {
    children : React.ReactNode
}

export default function Errors({children} : ErrorsProps) {
  return (
    <p className="text-red-500">{children}</p>
  )
}
