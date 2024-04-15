import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import React from 'react'

const MobileNav = () => {
  return (
    <Sheet>
    <SheetTrigger asChild >
      <div className='bg-sky-600 p-1 flex items-center justify-center hover:bg-sky-700 transition text-white h-[30px] w-[30px] rounded cursor-pointer'>
        <Menu/>
      </div>
    </SheetTrigger>
    <SheetContent side='left'>
      <SheetHeader>
        <SheetTitle className='text-xl font-black text-sky-600'>Thuso.com</SheetTitle>
        <Separator orientation="horizontal" className='h-[2px] bg-sky-700'/>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        
       
      </div>
      
    </SheetContent>
  </Sheet>
  )
}

export default MobileNav