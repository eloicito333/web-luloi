import ConfigSection from '@/components/widgets/admin/config/ConfigSection'
import React from 'react'

const configurationTypes = {
  dropdown: "dropdown"
}

const configurationSections = [
  {
    id: "user",
    name: "USER",
    description: "User related configuration.",
    fields: [
      {
        id: "userDefaultRole",
        name: "USER DEFAULT ROLE",
        description: "Role that new users will be assigned by default.",
        type: configurationTypes.dropdown,
        optionValues: [
          {
            name: "USER",
            value: "USER"
          },
          {
            name: "AUTH",
            value: "AUTH"
          },
          {
            name: "ADMIN",
            value: "ADMIN"
          },
        ],
        sendUrl: "/api/admin/config/userDefaultRole"
      }
    ]
  }
]

function AdminConfigPage() {
  return (
    <div className='p-4 flex flex-col justify-start items-center gap-4'>
      <h1 className='text-4xl sm:text-5xl font-bold mb-2'>Configuration</h1>
      {configurationSections.map((section, index) => (
        <ConfigSection key={index} section={section} />
      ))}
    </div>
  )
}

export default AdminConfigPage