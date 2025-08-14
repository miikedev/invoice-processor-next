import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <div className='w-screen h-screen flex flex-col items-center pt-[5rem]'>
      <SignUp />
    </div>
}