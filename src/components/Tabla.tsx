import { OrdenarPor, type User } from '../types.d'

interface Props {
  users: User[]
  color: boolean
  deleteUser: (email: string) => void
  sort: (sort: OrdenarPor) => void
}

const Tabla = ({ users, color, deleteUser, sort }: Props) => {
  return (
        <table style={{ width: '100%' }}>

            <thead style={{ margin: '30px 0 0 50px' }}>
                <tr>
                    <th>Imagen</th>
                    <th onClick={() => { sort(OrdenarPor.NAME) }}>Nombre</th>
                    <th onClick={() => { sort(OrdenarPor.LAST) }}>Apellido</th>
                    <th onClick={() => { sort(OrdenarPor.COUNTRY) }}>Pais</th>
                    <th>Eliminar Usuario</th>
                </tr>
            </thead>

            <tbody>
                {
                    users.map((usuario, indice) => {
                      const backgrounColor = indice % 2 === 0 ? '#333' : '#555'
                      const col = color ? backgrounColor : 'transparent'

                      return (
                            <tr key={usuario.email} style={{ backgroundColor: col }}>
                                <td>
                                    <img src={usuario.picture.thumbnail}/>
                                </td>
                                <td>{usuario.name.first}</td>
                                <td>{usuario.name.last}</td>
                                <td>{usuario.location.country}</td>
                                <td><button onClick={() => { deleteUser(usuario.email) }}>Eliminar</button></td>
                            </tr>
                      )
                    })
                }
            </tbody>

        </table>
  )
}
export default Tabla

/*
    table > cuadro
    thead > la parte de arriba del cuadro, la cabecera
    tbody > el cuarpo del cuadro, toda la info/data
    th > celdas del header
    tr > filas row
    td > celdas data
*/
