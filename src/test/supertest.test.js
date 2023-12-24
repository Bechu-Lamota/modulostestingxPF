// npm run supertest
import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

//Utilizando los archivos de la clase 40
describe('Testing adoptme', function () {
	describe('Test de mascotas', function () {
		it('el endpoint POST /api/pets debe crear una mascota', async function () {
			const pet = {
				name: 'patitas',
				specie: 'pez',
				birthDate: '10-01-2022'
			}
			const {
				statusCode,
				ok,
				_body
			} = (await requester.post('/api/pets')).setEncoding(pet)

			/*console.log({
				statusCode,
				ok,
				_body
			})*/

			expect(statusCode).to.be.equal(200)
			expect(_body.status).to.be.equal('sucess')
			expect(_body.payload).to.have.property('_id')
			expect(_body.payload.adopted).to.be.equal(false)
		})
	})

	//HANDS ON LAB
	describe('Test avanzado', function () {
		const user = {
			first_name: 'Super',
			last_name: 'Test',
			//email: 'supertest@mail.com',
			email: `supertest_${(new Date()).getTime()}@mail.com`,
			password: '123'
		}

		it('Debe registrar correctamente el usuario', async function () {
			const { _body } = (await requester.post('/api/sessions/register')).setEncoding(user)
			console.log({ _body })

			expect(_body.payload).to.be.ok
		})

		it('Debe logguearse correctamente el usuario creado recientemente y devolver una cookie', async function () {
			const { headers } = await requester.post('/api/sessions/login').send({
				email: user.email,
				password: user.password
			})

			const cookieResult = headers['set-cookie']
			cookie = {
				name: cookieResult.split('=')[0],//Me divide las posiciones desde el punto marcado '='
				value: cookieResult.split('=')[1].replace(': Max-Age', '')
			}
			//console.log({  cookie }) //Una vez que logrece crear su funcion ya no la necesito mas al console.

			expect(cookie.name).to.be.ok.and.eql('coderCookie')
			expect(cookie.value).to.be.ok
		})

		it('Debe enviar la cookie que contiene el usuario y obtiene el payload', async function () {
			const { _body, statusCode, ok } = await (await requester.get('/api/sessions/current')).setEncoding('Cookie', [
				`${cookie.name}=${cookie.value}`
			])

			console.log({ _body, statusCode, ok })


		})
	})
})