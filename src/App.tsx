import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { OrdenarPor, type User } from './types.d'
import Tabla from './components/Tabla'

function App () {
  const [users, setUsers] = useState < User[]>([])
  const [colors, setColor] = useState(false)
  const [order, setOrder] = useState<OrdenarPor>(OrdenarPor.NONE)
  const [filtroPais, serFiltroPais] = useState <string | null>(null)

  // Se podria crear otro estado y guardar ahi un arreglo que no se toque. Otra forma de hacerlo es con useRef:
  // Guarda un valor que queremos que se comparta entre renderizados pero que al cambiar, NO VUELVA A RENDERIZAR EL
  // COMPONENTE
  const todosLosUsuarios = useRef <User[]>([])

  const cambiarColor = () => {
    setColor(!colors)
  }

  const ordenarXPais = () => {
    const nuevoValorDeOrden = order === OrdenarPor.NONE ? OrdenarPor.COUNTRY : OrdenarPor.NONE
    setOrder(nuevoValorDeOrden)
  }

  const borrarUsuario = (email: string) => {
    const filterUser = users.filter(user => user.email !== email)
    setUsers(filterUser)
  }

  const resetUser = () => {
    setUsers(todosLosUsuarios.current)
  }

  const handleChangeSort = (sort: OrdenarPor) => {
    setOrder(sort)
  }

  // 1- Primero filtramos los usuarios por pais

  // useMemo() la sintaxis es como la del useEffect, tenemos una funcion y un arreglo donde le pasamos los estados en los que
  // queremos que este atento para que ejecute la funcion cuando se modifiquen esos estados.
  // useMemo guarda/memorisa el valor de la constante y no lo cambia (no ejecuta la funcion) a no ser que cambien los valores
  // de los elementos que le pasamos en el arreglo de dependencias.
  // Entonces de esta manera no ejecutamos las dos funciones siempre, sino cuando son necesarias (cuando cambia el estado)
  const usuarioXPais = useMemo(() => {
    return typeof filtroPais === 'string'
      ? users.filter(usuario => usuario.location.country.toUpperCase().includes(filtroPais.toUpperCase()))
      : users
  }, [users, filtroPais])

  // 2- despues los ordenamos.
  const mostrarUsuarios = useMemo(() => {
    // [...usuariosXPais].sort({a, b}) => { ... }  Asi seria con el sort.
    // metodo .toSorted() genera una copia del arr original, que no lo hace el metodo .sort()
    if (order === OrdenarPor.NONE) return usuarioXPais

    let funcionSorted = (a: User, b: User) => a.location.country.localeCompare(b.location.country)

    if (order === OrdenarPor.NAME) {
      funcionSorted = (a, b) => a.name.first.localeCompare(b.name.first)
    }

    if (order === OrdenarPor.LAST) {
      funcionSorted = (a, b) => a.name.last.localeCompare(b.name.last)
    }

    return usuarioXPais.toSorted(funcionSorted)

    // Otra opcion seria comparando solo las propiedades de User, con un objeto:
    // esta opcion esta buena por que solo hay que agregar propiedades al objeto, y solo tenemos una funcion tosorted

    // if (order === OrdenarPor.NONE) return usuarioXPais

    // const compararPropiedades: Record< string, (user: User) => any > = {
    //   [OrdenarPor.COUNTRY]: user => user.location.country,
    //   [OrdenarPor.NAME]: user => user.name.first,
    //   [OrdenarPor.LAST]: user => user.name.last
    // }

    // return usuarioXPais.toSorted((a, b) => {
    //   const extraerPropiedad = compararPropiedades[order]
    //   return extraerPropiedad(a).localeCompare(extraerPropiedad(b))
    // })

    // -----------------------------
    // return order === OrdenarPor.COUNTRY
    //   ? usuarioXPais.toSorted((a, b) => {
    //     return a.location.country.localeCompare(b.location.country)
    //   })
    //   : usuarioXPais
  }, [usuarioXPais, order])

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        todosLosUsuarios.current = res.results
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  //

  return (
    <>
      <h1>Prueba Tecnica</h1>
      <header style={{ padding: '30px 10px' }}>
        <button onClick={cambiarColor}>Colorear filas</button>
        <button onClick={ordenarXPais}>{order === OrdenarPor.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'}</button>
        <button onClick={resetUser}>Restablecer usuarios eliminados</button>
        <input type='text' onChange={(e) => { serFiltroPais(e.target.value) }}/>
      </header>

      <main>

        <Tabla color={colors} users={mostrarUsuarios} deleteUser={borrarUsuario} sort={handleChangeSort} />
      </main>
    </>
  )
}

export default App
