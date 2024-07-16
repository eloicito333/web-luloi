import React from 'react'

const getNameInitials = (name) => {
  return name.trim().split(" ").map((word, index) => index < 1 ? word[0] : null).join("").toUpperCase()
}

function UserIconFallback({name}) {
  
  return (
    <div className="w-full aspect-square bg-purple-300">{getNameInitials(name)}</div>
  )
}

export default UserIconFallback