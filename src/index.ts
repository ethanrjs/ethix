import fs from 'fs';
import { Router } from '@stricjs/router';
import { file, group } from '@stricjs/utils';

const plugin = group('public');

export default new Router({
  port: 6543
})
  .plug(plugin)
  .get('/', file('public/index.html'))
  .get('/scripts', async () => {
    const scriptPaths: string[] = [];
    const folders = await fs.promises.readdir('public/apps');

    const folderPromises = folders.map(async (folder) => {
      const files = await fs.promises.readdir(`public/apps/${folder}`);
      return files.filter(file => file.endsWith('.js')).map(file => `apps/${folder}/${file}`);
    });

    const nestedScriptPaths = await Promise.all(folderPromises);
    nestedScriptPaths.forEach(paths => scriptPaths.push(...paths));

    return Response.json(scriptPaths);
  });
