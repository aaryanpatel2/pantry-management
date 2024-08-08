'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

export default function Home() {
const [inventory, setInventory] = useState([])
const [open, setOpen] = useState(false)
const [itemName, setItemName] = useState('')

const updateInventory = async () => {
  const snapshot = query(collection(firestore, 'inventory'))
  const docs = await getDocs(snapshot)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() })
  })
  setInventory(inventoryList)
}

useEffect(() => {
  updateInventory()
}, [])

const addItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    await setDoc(docRef, { quantity: quantity + 1 })
  } else {
    await setDoc(docRef, { quantity: 1 })
  }
  await updateInventory()
}

const removeItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    if (quantity === 1) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, { quantity: quantity - 1 })
    }
  }
  await updateInventory()
}

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)



return (
  <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
    bgcolor="black"
  >
    <Typography variant="h2" color={'white'} sx={{p: 2}}>Inventory Management</Typography>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
      display={'flex'}
      justifyContent={'center'} 
      alignItems={'center'}
      p={5}>
        <Typography id="modal-modal-title" variant="h6" component="h2" >
          Add Item
        </Typography>
        <Stack width="50%" direction={'row'} spacing={2}> 
          <TextField
          style={{backgroundColor: "white", color: "black"}}
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
          style={{backgroundColor: "white", color: "black",}}
            variant="outlined"
            p
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button style={{backgroundColor: "white", color: "black", margin: 20}} variant="contained" onClick={handleOpen} sx={{':hover': {bgcolor: 'darkblue'}}}>
      Add New Item
    </Button>
    <Box border={'5px solid white'}>
      <Box
        width="800px"
        height="100px"
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'white'} textAlign={'center'}>
          Inventory Items
        </Typography>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            paddingX={5}
            border="3px solid white"
          >
            <Typography variant={'h3'} color={'white'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h3'} color={'white'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <Button style={{backgroundColor: "white", color:"black"}} variant="contained" onClick={() => removeItem(name)} sx={{ ':hover': {bgcolor: 'darkblue', transform: '1.1'}}}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
)
        }

