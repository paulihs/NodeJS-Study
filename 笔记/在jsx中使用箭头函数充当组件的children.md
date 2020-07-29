```javascript
class app {
    render(){
        return (
            <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={60}
            noRowsRenderer={this.noRowsRenderer}
            headerHeight={headerHeight}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
        );
    }
}
```

### 在组件中直接使用箭头函数作为组件的children，实际上在组件内部将this.props.children 作为函数使用传入参数：this.props.children(width, height),而在箭头函数中，可以将形式参数传入返回的组件