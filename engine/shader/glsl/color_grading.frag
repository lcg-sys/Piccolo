#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{

    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec2 size = vec2(lut_tex_size.x, lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;

    highp float num = size.x / size.y;

    highp float blue = floor(color.b * num);
    highp float red = floor(color.r * size.y);
    highp float green = floor(color.g * size.y);
    // highp float blue = color.b * num;
    // highp float red = color.r * size.y;
    // highp float green = color.g * size.y;

    highp float red_weight = fract(color.r * size.y);
    highp float greed_weight = fract(color.g * size.y);
    highp float blue_weight = fract(color.b * num);

    // //做了一个三线性插值(大概),结果发现r和g的值已经插值了,只需要对b做插值
    // highp vec4 color_1 = mix(
    //     mix(texture(color_grading_lut_texture_sampler, vec2((blue * size.y + red) / size.x, green / size.y)), 
    //     texture(color_grading_lut_texture_sampler, vec2((blue * size.y + red + 1.0) / size.x, green / size.y)), red_weight), 
    //     mix(texture(color_grading_lut_texture_sampler, vec2((blue * size.y + red) / size.x, (green + 1.0) / size.y)), 
    //     texture(color_grading_lut_texture_sampler, vec2((blue * size.y + red + 1.0) / size.x), (green + 1.0) / size.y), red_weight), greed_weight);
    // highp vec4 color_2 = mix(
    //     mix(texture(color_grading_lut_texture_sampler, vec2(((blue + 1.0) * size.y + red) / size.x, green / size.y)), 
    //     texture(color_grading_lut_texture_sampler, vec2(((blue + 1.0) * size.y + red + 1.0) / size.x, green / size.y)), red_weight), 
    //     mix(texture(color_grading_lut_texture_sampler, vec2(((blue + 1.0) * size.y + red) / size.x, (green + 1.0) / size.y)), 
    //     texture(color_grading_lut_texture_sampler, vec2(((blue + 1.0) * size.y + red + 1.0) / size.x, (green + 1.0) / size.y)), red_weight), greed_weight);

    highp vec4 color_1 = texture(color_grading_lut_texture_sampler, vec2((blue * size.y + color.r * size.y) / size.x, color.g));
    highp vec4 color_2 = texture(color_grading_lut_texture_sampler, vec2(((blue + 1.0) * size.y + color.r * size.y) / size.x, color.g));

    highp vec4 color_sampled = mix(color_1, color_2, blue_weight);

    // // highp vec2 uv = vec2((color.b * _COLORS + color.r), color.g);

    // // highp vec4 color_sampled = texture(color_grading_lut_texture_sampler, uv);

    out_color = color_sampled;
}
