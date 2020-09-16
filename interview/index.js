

const slideOut = (element, duration) => {
        element.style.position = 'absolute';
    const moveBox = ()=>{
        element.style.left =  parseInt(element.style.left, 10)+5 + `%`
        if(){

        }
    }
    requestAnimationFrame()
    console.log("slide out implementation");

    // TODO
};

const box = document.getElementById("box");

box.addEventListener("click", event => {
    slideOut(event.target, 1);
});


输入一个无序的非负整数数组nums和一个整数sum，找到nums的一个连续的子数组，使其相加的和为sum。
输出子数组的开始索引值start，和结束索引值end。
示例:
    输入: nums: [2, 5, 4, 7, 8], sum: 9
输出: {start: 1, end: 2}
要求: 时间复杂度为O(n)
function test(nums, sum) {
    // TODO
}


