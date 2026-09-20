# Dynasty

A persistent-world game of gathering, building, and long-horizon networks: play with economic consequence on a continuous map, not a tile empire.

This repo is the design corpus, simulation kernel, browser world prototype, and Unreal 5.8 demonstrator.

## Layout

| Path | Role |
| --- | --- |
| `docs/design/` | Canonical design source of truth |
| `src/` | Simulation kernel and playtests |
| `prototype/` | Browser presentation of the kernel |
| `world/` | WebGPU/Three world prototype |
| `DynastyWorld/` | Unreal Engine 5.8 demonstrator |

## Run

```bash
npm install
npm test
npm run prototype
```

World prototype:

```bash
cd world && npm install && npm run dev
```

Design entry point: [`docs/design/README.md`](docs/design/README.md).
