import React, { useEffect, useMemo, useState } from 'react'
import ButtonMain from 'renderer/base-components/ButtonMain'
import useDebounce from 'renderer/hooks/useDebounce'

interface DeleteButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

const defaultProps = {
  onClick: null,
}

function DeleteButton(props: DeleteButtonProps) {
  const { onClick, children } = props

  const [firstClick, setFirstClick] = useState<boolean>(true)

  const debounce = useDebounce(firstClick, 3000)

  const buttonTitle = useMemo(() => {
    return firstClick ? children : 'Are you sure?'
  }, [firstClick, children])

  const handleOnClick = () => {
    if (!firstClick) {
      onClick?.()
      setFirstClick(true)
    }

    setFirstClick(false)
  }

  useEffect(() => {
    setFirstClick(true)
  }, [debounce])

  return (
    <ButtonMain danger bordered onClick={handleOnClick}>
      {buttonTitle}
    </ButtonMain>
  )
}

DeleteButton.defaultProps = defaultProps

export default DeleteButton
