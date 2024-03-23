import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import React from 'react'

function ActivatePWAModal({openModalRef, setIsPageLoockingClear}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleModalClose = () => {
    console.log("modal closed")
    setIsPageLoockingClear(true)
  }

  return (
    <>
    
    <button className="hidden absolute" onClick={onOpen} ref={openModalRef}/>

    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleModalClose} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Afegeix l&apos;app a la pantalla d&apos;inici</ModalHeader>
              <ModalBody>
                <p>Has d&apos;afegir aquesta web a la pantall d&apos;inici per poder gaudir de totes les seves funcionalitats.</p>
                <p>Segueix els passos d&apos;aquest tutorial o contacta amb mi per aconseguir ajuda.</p>
                <div className="flex justify-center items-center">
                  <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/7X-9zh2sDH4?si=1LAJmhIxh6W4oYY5" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={onClose}>
                  D&apos;acord
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal></>
  )
}

export default ActivatePWAModal