import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ButtonMain from 'renderer/base-components/ButtonMain'
import useDebounce from 'renderer/hooks/useDebounce'

interface DeleteButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const defaultProps = {
  onClick: null,
  className: '',
}

function DeleteButton(props: DeleteButtonProps) {
  const { onClick, children, className } = props

  const [firstClick, setFirstClick] = useState<boolean>(true)

  const debounce = useDebounce(firstClick, 3000)

  const buttonTitle = useMemo(() => {
    return firstClick ? children : 'Are you sure?'
  }, [firstClick, children])

  const handleOnClick = useCallback(() => {
    if (!firstClick) {
      onClick?.()
      setFirstClick(true)
    }

    setFirstClick(false)
  }, [firstClick, onClick])

  useEffect(() => {
    setFirstClick(true)
  }, [debounce])

  return (
    <ButtonMain
      sm
      primary
      bordered
      className={classNames({
        [className!]: !!className,
      })}
      onClick={handleOnClick}
    >
      {buttonTitle}
    </ButtonMain>
  )
}

DeleteButton.defaultProps = defaultProps

export default DeleteButton
