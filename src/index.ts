import fs from 'fs';
import { Router } from '@stricjs/router';
import { macro } from '@stricjs/router';
import { file, dir, group } from '@stricjs/utils';

// new Elysia()
//   .use(staticPlugin({
//     assets: 'public'
//   })) // defaults to /public

//   .get('/', () => Bun.file('public/index.html'))
//   .get('/scripts', async () => {
//     const scriptPaths = [];
//     const folders = await fs.promises.readdir('public/apps');
//     for (const folder of folders) {
//       const files = await fs.promises.readdir(`public/apps/${folder}`);
//       for (const file of files) {
//         if (file.endsWith('.js')) {
//           scriptPaths.push(`apps/${folder}/${file}`);
//         }
//       }
//     }
//     return scriptPaths;
//   })
//   .listen(6543);
const plugin = group('public');

export default new Router({
  port: 6543
})
  .plug(plugin)
  .get('/', file('public/index.html'))
  .get('/scripts', async () => {
    const scriptPaths = [];
    const folders = await fs.promises.readdir('public/apps');
    for (const folder of folders) {
      const files = await fs.promises.readdir(`public/apps/${folder}`);
      for (const file of files) {
        if (file.endsWith('.js')) {
          scriptPaths.push(`apps/${folder}/${file}`);
        }
      }
    }
    return Response.json(scriptPaths);
  })
