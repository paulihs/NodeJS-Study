#### Webpack的构建流程

webpack的运行流程是一个串行的过程。从启动到结束会依次执行一下流程：

- **初始化参数**：从配置文件和shell语句中读取与合并参数，得到最终的参数。
- **开始编译**：用上一步得到的参数初始化compiler对象。加载所有配置的插件，执行对象的run方法开始执行编译。
- **确定入口**：根据配置中的entry找到所有的入口文件。
- **编译模块**：从入口文件出发，调用所有配置的loader，对模块进行编译，再找出该模块所依赖的模块，递归遍历所有模块，直到入口文件的依赖都完成编译。
- **完成模块编译**：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
- **输出资源**：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。
- **输出完成**：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

