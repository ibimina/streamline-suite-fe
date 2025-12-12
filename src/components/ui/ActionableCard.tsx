'üse client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { formatDate } from 'date-fns'

// import ExploreImage from "../../../public/explore.png";
import { useCurrentUserState } from '@/stores/user.store'
const ActionableCard = ({
  title,
  date,
  onEdit,
  onDelete,
  click,
  name,
  generateEventQrCode,
}: {
  title: string
  date: string | Date
  onEdit?: () => void
  onDelete: () => void
  click?: () => void
  name?: string
  generateEventQrCode?: () => void
}) => {
  const { currentUser } = useCurrentUserState()
  const canAccessPage = ['Admin', 'SuperAdmin'].includes(currentUser.role.role)
  const [openDropdown, setOpenDropdown] = useState(false)
  return (
    <Card className='flex items-center justify-between bg-white rounded-[20px] pl-8 py-4 pr-4 mb-4'>
      <p
        className='font-semibold cursor-pointer text-xs lg:text-md leading-[25px] line-clamp-1 lg:max-w-[400px] overflow-hidden'
        onClick={click}
      >
        {title}
      </p>

      <div className='flex items-center gap-10'>
        {name && <p className='text-black font-normal text-sm leading-[18.55px]'>{name}</p>}

        <p className='text-black font-normal text-sm leading-[18.55px]'>
          {formatDate(new Date(date), 'MMM do yyyy')}
        </p>
        {canAccessPage && (
          <div className='flex items-center gap-4'>
            {generateEventQrCode && (
              <button
                className='hidden lg:block border border-[#353434] w-max p-2 h-[38px] text-center bg-[#94ec94] text-[#1E1D1D] rounded-[2px] text-lg leading-[18.55px]'
                onClick={generateEventQrCode}
              >
                QR Code
              </button>
            )}

            {onEdit && (
              <button
                className='hidden lg:block border border-[#353434] w-[66px] h-[38px] text-center bg-[#E3E2E2] text-[#1E1D1D] rounded-[2px] text-lg leading-[18.55px]'
                onClick={onEdit}
              >
                Edit
              </button>
            )}
            <button
              className='hidden lg:block border border-[#A50508] w-[92px] h-[38px] text-center bg-[#FFE6E6] text-[#900104] rounded-[2px] text-lg leading-[18.55px]'
              onClick={onDelete}
            >
              Delete
            </button>
            <div className='relative lg:hidden'>
              <Image
                src={'/explore.png'}
                width={24}
                height={24}
                alt='explore'
                onClick={() => setOpenDropdown(!openDropdown)}
              />
              {openDropdown && (
                <div
                  className='absolute -bottom-10 h-[76px] w-[100px]  right-5
                   bg-white px-4 z-40 shadow-md rounded-md mt-8'
                >
                  {onEdit && (
                    <button
                      className=' text-center  text-[#1E1D1D]  text-md leading-[18.55px]'
                      onClick={() => {
                        setOpenDropdown(!openDropdown)
                        onEdit()
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {generateEventQrCode && (
                    <button
                      className='text-left w-max text-[#94ec94]   text-sm leading-[18.55px]'
                      onClick={generateEventQrCode}
                    >
                      QR Code
                    </button>
                  )}
                  <button
                    className=' text-center  text-[#900104]  text-md leading-[18.55px]'
                    onClick={() => {
                      setOpenDropdown(!openDropdown)
                      onDelete()
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ActionableCard
