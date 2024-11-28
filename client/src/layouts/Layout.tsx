import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header className='bg-slate-800 text-white font-bold py-10 text-2xl md:text-4xl xl:text-5xl'>
        <div className='mx-auto w-5/6'>
          <h1>Administrador de Produtos</h1>
        </div>
      </header>
      
      <main className='bg-white shadow mx-auto w-5/6 mt-10 p-10 rounded-md'>
          <Outlet/>
      </main>
    </>
  )
}
