import $ from "jquery";
import {stackGlow,glowBlock,report,changeValue} from "./../webtools/scratchify.js"
import scratchify from './../webtools/scratchify.js';


$(document).ready(function() {
    scratchify();
});

$(document).ready(function() {
    
    let navListItems = $('ul.setup-panel li a'),
        allWells = $('.setup-content');

    //allWells.hide();

    navListItems.click(function(e)
    {
        e.preventDefault();
        let $target = $($(this).attr('href')),
            $item = $(this).closest('li');
        
        if (!$item.hasClass('disabled')) {
            navListItems.closest('li').removeClass('active');
            $item.addClass('active');
            //allWells.hide();
            scrollTo($target);
            $target.show();
        }
    });
    $('#activate-step-A').click(function(e)
    {
        e.preventDefault();
    });
    $('#activate-step-A').on('click', function(e) {
        //$('ul.setup-panel li:eq(1)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-A"]').trigger('click');
        //$(this).remove();
    });
    //$('ul.setup-panel li.active a').trigger('click');
    $('#activate-step-1').click(function(e)
    {
        e.preventDefault();
    });
    $('#activate-step-1').on('click', function(e) {
        //$('ul.setup-panel li:eq(1)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-1"]').trigger('click');
        //$(this).remove();
    });
    $('#activate-step-2').click(function(e)
    {
        e.preventDefault();
    })
    $('#activate-step-2').on('click', function(e) {
        // $('ul.setup-panel li:eq(2)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-2"]').trigger('click');
        //$(this).remove();
    })
    $('#activate-step-3').click(function(e)
    {
        e.preventDefault();
    })    
    $('#activate-step-3').on('click', function(e) {
        // $('ul.setup-panel li:eq(3)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-3"]').trigger('click');
        //$(this).remove();
    })
    $('#activate-step-4').click(function(e)
    {
        e.preventDefault();
    })    
    $('#activate-step-4').on('click', function(e) {
        //$('ul.setup-panel li:eq(4)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-4"]').trigger('click');
        //$(this).remove();
    })
    $('#activate-step-5').click(function(e)
    {
        e.preventDefault();
    })    
    $('#activate-step-5').on('click', function(e) {
        // $('ul.setup-panel li:eq(5)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-5"]').trigger('click');
        // $(this).remove();
    })
    $('#activate-step-6').click(function(e)
    {
        e.preventDefault();
    })
    $('#activate-step-6').on('click', function(e) {
        // $('ul.setup-panel li:eq(6)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-6"]').trigger('click');
        // $(this).remove();
    })

    //glow-Div1
    // $('#glow-Div1').click(function(e)
    // {
    //     e.preventDefault();
    // })

    // let div0glow = true;
    // $('#glow-Div1').on('click', function(e) {
    //     console.log('hello world');
    //     stackGlow('Div0',1,div0glow);
    //     glowBlock('Div0',1,div0glow);
    //     report('Div0',1,'appelboom');
    //     div0glow = !div0glow;
    // })

    $('#glow-repeat-div1').click(function(e)
    {
        e.preventDefault();
    })
    let div1glow = true;
    $("#glow-repeat-div1").on('click', function(e) {
        stackGlow('nul',8,div1glow); //WHY verdwijnt het hier?????? -> dut is niet als het het eerste is
        glowBlock('nul',6,div1glow);
        div1glow = !div1glow;
    })
   //glow vier
    $('#glow-four-div2 ').click(function(e)
    {
        e.preventDefault();
    })
    let div2glow = true;
    let div2value = 4;

    function changeGlowDiv2(){
        stackGlow('vierkant',7,div2glow); 
        stackGlow('vierkant',13,div2glow); 
        //glowBlock('Div1',6,div1glow);
        div2glow = !div2glow;
    }

    function glowDiv2(){
        div2glow = true;
        changeGlowDiv2();
    }

    function setValueDiv2(value){
        changeValue('vierkant',7, value);
        changeValue('vierkant',13, value);
        div2value = value;
    }

    $("#glow-four-div2").on('click', function(e) {
        if(div2value == 4){
            changeGlowDiv2();
        }else{
            glowDiv2();
            setValueDiv2(4);
        }

    })
    //five
    $('#glow-five-div2 ').click(function(e)
    {
        e.preventDefault();
    })
    $("#glow-five-div2 ").on('click', function(e) {
        if(div2value == 5){
            changeGlowDiv2();
        }else{
            glowDiv2();
            setValueDiv2(5);
        }

    })
    //high
    $('#glow-high-div2 ').click(function(e)
    {
        e.preventDefault();
    })
    $("#glow-high-div2 ").on('click', function(e) {
        if(div2value == 30){
            changeGlowDiv2();
        }else{
            glowDiv2();
            setValueDiv2(30);
        }

    })
    //glow half
    $('#glow-Div3-half').click(function(e)
    {
        e.preventDefault();
    })
    let div3glow = true;
    $("#glow-Div3-half").on('click', function(e) {
        stackGlow('cwcirkel',5,div3glow); 
        stackGlow('cwcirkel',7,div3glow); 
        report('cwcirkel',5,'15');
        //glowBlock('Div1',6,div1glow);
        div3glow = !div3glow;
    })
    //glow-Div3-richting
    $('#glow-Div3-richting').click(function(e)
    {
        e.preventDefault();
    })
    let div3glow2 = true;
    $("#glow-Div3-richting").on('click', function(e) {
        //stackGlow('Div3',5,div3glow); 
        //stackGlow('Div3',7,div3glow); 
        glowBlock('cwcirkel',10,div3glow2);
        glowBlock('ccwcirkel',10,div3glow2);
        div3glow2 = !div3glow2;
    })


    //scrollTo($("#tittletext"));
    
});



function scrollTo(target){
    //target: jquery element
    let position = target.position();
    scroll(0,position.top);
}