interface Preset {
  readonly name: string;
  readonly options: any;
}

interface PresetOptions {
  readonly presetsList: Preset[];
}

export function webpackFinal(
  webpackConfig: any = {},
  options: PresetOptions = { presetsList: [] }
) {
  let vueDocgenOptions = {};

  options.presetsList.forEach((preset) => {
    if (preset.name.includes('addon-docs') && preset.options.vueDocgenOptions) {
      const appendableOptions = preset.options.vueDocgenOptions;
      vueDocgenOptions = {
        ...vueDocgenOptions,
        ...appendableOptions,
      };
    }
  });

  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: require.resolve('vue-docgen-loader', { paths: [require.resolve('@storybook/vue')] }),
    enforce: 'post',
    options: {
      docgenOptions: {
        alias: webpackConfig.resolve.alias,
        ...vueDocgenOptions,
      },
    },
  });
  return webpackConfig;
}
