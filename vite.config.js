import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        machine1: resolve(__dirname, 'machine1.html'),
        machine2: resolve(__dirname, 'machine2.html'),
        hairRemovalLasers: resolve(__dirname, 'categories/hair-removal-lasers.html'),
        multifunctionalLasers: resolve(__dirname, 'categories/multifunctional-lasers.html'),
        hydraFacial: resolve(__dirname, 'categories/hydra-facial.html'),
        qSwitchLaser: resolve(__dirname, 'categories/q-switch-laser.html'),
        co2Fractional: resolve(__dirname, 'categories/co2-fractional.html'),
        hifuAntiAging: resolve(__dirname, 'categories/hifu-anti-aging.html'),
        cauteryMachines: resolve(__dirname, 'categories/cautery-machines.html'),
        dermaFurniture: resolve(__dirname, 'categories/derma-furniture.html'),
        accessories: resolve(__dirname, 'categories/accessories.html')
      }
    }
  },
  publicDir: 'public'
});
