import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import fs from 'fs/promises'
import path from 'path'

export async function GET({ url }) {
  const quizTitle = '¿Adivina la definición?'
  const text = url.searchParams.get('text') ?? 'Hogaza de pan plano, típica de la región mediterránea de España, además de Andorra y la Cataluña francesa, que se usa asimismo como base para otras preparaciones dulces y saladas.'

  const fontPath = path.resolve('./assets/fonts/Inter-Thin.ttf')
  const fontData = await fs.readFile(fontPath)

  const ratio = 72 / 96; // DPI of the output image (default is 96)
  const quotient = 4;


  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          fontFamily: 'Arial',
          backgroundColor: '#fff',
        },
        children: [
          {
            type: 'h1',
            props: {
              style: {
                fontSize: Math.floor(80 / quotient),
                marginBottom: 1,
                color: '#333',
                textAlign: 'center',
              },
              children: quizTitle,
            },
          },
          {
            type: 'p',
            props: {
              style: {
                fontSize: Math.floor(60 / quotient),
                color: '#555',
                textAlign: 'center',
                maxWidth: '100%',
              },
              children: text,
            },
          },
        ],
      },
    },
    {
      width: 1200 / quotient,
      height: 830 / quotient,
      fonts: [
        {
          name: 'Arial',
          data: fontData,
          weight: 100,
          style: 'normal',
        },
      ],
    }
  )

  const resvg = new Resvg(svg)
  const pngBuffer = resvg.render().asPng();

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
