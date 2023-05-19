export type ButtonProps = {
  text: string
  className?: string
  onClick: () => void
}

const Button = (props: ButtonProps) => {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.text}
    </button>
  )
}

export default Button
