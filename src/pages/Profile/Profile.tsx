import { useState } from 'react'
import PersonalDataBox from '../../components/PersonalDataBox/PersonalDataBox'
import { PersonalData } from '../../components/PersonalDataBox/types'

function Profile() {
  const [data, setData] = useState<PersonalData>({
    nickname: 'JohnDoe',
    name: 'John',
    surname: 'Doe',
    dateOfBirth: '1990-01-01',
    avatar: '',
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => setIsEditing(true)
  const handleSave = () => setIsEditing(false)
  const handleCancel = () => setIsEditing(false)
  const handleChange = (updatedData: Partial<PersonalData>) => {
    setData((prevData) => ({ ...prevData, ...updatedData }))
  }

  return (
    <div>
      <PersonalDataBox
        data={data}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onChange={handleChange}
      />
    </div>
  )
}

export default Profile
