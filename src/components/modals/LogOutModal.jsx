import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import React, { useEffect, useRef } from 'react'
import { useAppContext } from '../Providers/AppProvider';


function LogOutModal({openModalRef}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {setIsPageLookingClear} = useAppContext()
  const cancelBtnRef = useRef(null)

  const handleModalClose = () => {
    setIsPageLookingClear(true)
  }

  useEffect(() => {
    if(isOpen) cancelBtnRef?.current.focus()
  }, [isOpen])

  return (
    <>
    
    <button className="hidden absolute" onClick={onOpen} ref={openModalRef}/>

    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleModalClose} isDismissable={true} isKeyboardDismissDisabled={true} placement='center' className='w-fit px-7 py-4' >
        <ModalContent>
          {(onClose) => {
            const logOutBtnHandler = () => {
              signOut();
              onClose();
            }
            return (
              <>
                <ModalHeader className="flex flex-col items-center justify-center text-xl p-0 mb-2">Atenció!</ModalHeader>
                <ModalBody className='w-full p-2 flex flex-col gap-4 justify-center items-center'>
                  <p>Segur que vols tancar la sessió?</p>
                  <div className="flex flex-row jistify-center items-center gap-4">
                    <Button color="primary" onPress={onClose} ref={cancelBtnRef}>
                      Cancel·lar
                    </Button>
                    <Button color="danger" onPress={logOutBtnHandler}>
                      Log Out
                  </Button>
                  </div>
                </ModalBody>
              </>
            )
          }}
        </ModalContent>
      </Modal></>
  )
}

export default LogOutModal;