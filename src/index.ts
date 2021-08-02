import 'reflect-metadata';
import { SetupServer } from './server';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    `O aplicativo está saindo devido a uma promessa não tratada: ${promise} em razão de: ${reason}`
  );
  // lets throw the error and let the uncaughtException handle below handle it
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.error(
    `O aplicativo está saindo devido a uma exceção não detectada: ${error}`
  );
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer();
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    for (const exitSignal of exitSignals) {
      process.on(exitSignal, async () => {
        try {
          console.info(`App exited with success`);
          process.exit(ExitStatus.Success);
        } catch (error) {
          console.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      });
    }
  } catch (error) {
    console.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
