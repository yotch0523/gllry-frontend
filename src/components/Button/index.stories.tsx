import { StoryFn } from '@storybook/react'

import Button, { ButtonProps } from './index'

export default {
  title: 'Button',
  component: Button,
}

export const Index: StoryFn<ButtonProps> = (props) => {
  return <Button {...props}>index</Button>
}
