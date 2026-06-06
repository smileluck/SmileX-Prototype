interface MarkerPinProps {
  number: number
  style?: React.CSSProperties
  onClick?: () => void
  active?: boolean
}

export function MarkerPin({ number, style, onClick, active }: MarkerPinProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      style={{
        ...style,
        width: 24,
        height: 24,
        transform: 'translate(-50%, -50%)',
      }}
      className={`
        absolute flex items-center justify-center
        rounded-full text-xs font-bold text-white
        cursor-pointer select-none shadow-md
        transition-transform hover:scale-125
        ${active ? 'ring-2 ring-offset-1 ring-primary' : ''}
        bg-primary
      `}
    >
      {number}
    </div>
  )
}
