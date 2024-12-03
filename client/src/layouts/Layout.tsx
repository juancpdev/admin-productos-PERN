import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='grid min-h-screen grid-rows-[auto_1fr_auto]'>
      <header className='bg-slate-800 text-white font-bold py-10 text-2xl md:text-4xl xl:text-5xl'>
        <div className='mx-auto w-5/6'>
          <img className=' w-56' src="/stck-logo.png" alt="Logo Stck" />
        </div>
      </header>
      
      <main>
        <div className='bg-gray-50 shadow mx-auto w-4/6 my-10 p-10 rounded-md'>
            <Outlet/>
        </div>
      </main>

      <footer className="bg-slate-800 text-gray-400 text-center py-10">
        Created by
        <a className=" font-bold text-white hover:text-orange-300 transition-all" target="_blank" href="https://jpdeveloper.netlify.app/"> @Jpdev</a>
    </footer>
    </div>
  )
}
